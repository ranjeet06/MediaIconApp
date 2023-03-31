import { Page } from "@shopify/polaris";
import AccountSetting from "../components/AccountSetting.jsx";

export default function AccountManagement() {

    return (
        <Page fullWidth>
            <div className="page">
                <AccountSetting />
            </div>
        </Page>
    );
}