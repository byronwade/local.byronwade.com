import { render } from "@react-email/render";
import Welcome from "@components/emails/Welcome";
import PasswordReset from "@components/emails/PasswordReset";
import AccountActivation from "@components/emails/AccountActivation";
import NewJobNotification from "@components/emails/NewJobNotification";
import JobCompletion from "@components/emails/JobCompletion";
import AccountDeactivationWarning from "@components/emails/AccountDeactivationWarning";
import SubscriptionRenewalReminder from "@components/emails/SubscriptionRenewalReminder";

const emailTemplates = {
	welcome: Welcome,
	passwordReset: PasswordReset,
	accountActivation: AccountActivation,
	newJobNotification: NewJobNotification,
	jobCompletion: JobCompletion,
	accountDeactivationWarning: AccountDeactivationWarning,
	subscriptionRenewalReminder: SubscriptionRenewalReminder,
};

export const renderEmail = async (emailType, props) => {
	const EmailComponent = emailTemplates[emailType];

	if (!EmailComponent) {
		throw new Error(`Email template for type "${emailType}" not found`);
	}

	const html = await render(<EmailComponent {...props} />);
	return html;
};
