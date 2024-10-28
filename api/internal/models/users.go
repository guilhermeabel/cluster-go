package models

import (
	"database/sql"
	"errors"
	"strings"
	"time"

	"github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID             int
	Document       string
	Name           string
	Email          string
	Phone          string
	HashedPassword []byte
	Created        time.Time
}

type UserModel struct {
	DB *sql.DB
}

func (m *UserModel) Contacts(user_id int) ([]*User, error) {
	stmt := "SELECT id, name, email, COALESCE(phone, ''), created_at FROM contacts WHERE user_id = ?)"

	rows, err := m.DB.Query(stmt, user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*User{}

	for rows.Next() {
		u := &User{}
		err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Phone, &u.Created)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (m *UserModel) Insert(name, email, password, phone, document string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	if err != nil {
		return err
	}

	stmt := `INSERT INTO users (name, email, password, phone, document, created_at)
	VALUES(?, ?, ?, ?, ?, UTC_TIMESTAMP())`

	_, err = m.DB.Exec(stmt, name, email, string(hashedPassword), phone, document)
	if err != nil {
		var mySQLError *mysql.MySQLError

		if errors.As(err, &mySQLError) {
			if mySQLError.Number == 1062 && strings.Contains(mySQLError.Message, "users_uc_email") {
				return ErrDuplicateEmail
			}
		}

		return err

	}

	return nil
}

func (m *UserModel) InsertContact(user_id int, name, email string) error {
	stmt := `INSERT INTO contacts (user_id, name, email, created_at)
	VALUES(?, ?, ?, UTC_TIMESTAMP())`

	contact_id, err := m.DB.Exec(stmt, user_id, name, email)
	if err != nil {
		return err
	}

	stmt = `INSERT INTO user_contacts (user_id, contact_id)
	VALUES(?, ?)`

	_, err = m.DB.Exec(stmt, user_id, contact_id)
	if err != nil {
		return err
	}

	return nil
}

func (m *UserModel) Authenticate(email, password string) (int, error) {
	var id int
	var hashedPassword []byte

	stmt := "SELECT id, password FROM users WHERE email = ?"

	err := m.DB.QueryRow(stmt, email).Scan(&id, &hashedPassword)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, ErrInvalidCredentials
		}
		return 0, err
	}

	err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		return 0, ErrInvalidCredentials
	}
	if err != nil {
		return 0, err
	}

	return id, nil
}

func (m *UserModel) Get(id int) (*User, error) {
	u := &User{}

	stmt := "SELECT id, name, email, created_at FROM users WHERE id = ?"

	err := m.DB.QueryRow(stmt, id).Scan(&u.ID, &u.Name, &u.Email, &u.Created)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNoRecord
		}
		return nil, err
	}

	return u, nil
}

func (m *UserModel) Exists(id int) (bool, error) {
	var exists bool

	stmt := "SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)"

	err := m.DB.QueryRow(stmt, id).Scan(&exists)
	return exists, err
}

func (m *UserModel) All() ([]*User, error) {
	stmt := "SELECT id, name, COALESCE(phone, ''), email, created_at FROM users"

	rows, err := m.DB.Query(stmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*User{}

	for rows.Next() {
		u := &User{}
		err := rows.Scan(&u.ID, &u.Name, &u.Phone, &u.Email, &u.Created)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
