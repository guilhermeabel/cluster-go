import { SidebarTrigger } from "../ui/sidebar";
import Breadcrumbs from "./app-breadcrumbs";

const Topbar = () => {
	return (<div className="flex flex-row items-center mb-10">
		<SidebarTrigger />
		<Breadcrumbs />
	</div>);
}

export default Topbar
