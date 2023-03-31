import {
  Page,
} from "@shopify/polaris";
import './styles.css';
import SubscriptionPlans from "../components/SubscriptionPlans.jsx";

export default function HomePage() {

    return(
        <Page fullWidth>
            <div className="page">
                <SubscriptionPlans />
            </div>
        </Page>
    )
}