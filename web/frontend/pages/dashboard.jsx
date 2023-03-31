import { Page } from "@shopify/polaris";
import IconsSetting from "../components/IconsSetting.jsx";

export default function Dashboard() {

    return (
        <Page fullWidth>
            <div className="page">
                <IconsSetting />
            </div>
        </Page>
    );
}