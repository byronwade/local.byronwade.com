import { render } from "@react-email/render";
import Welcome from "@components/emails/Welcome";
import PasswordReset from "@components/emails/password-reset";
import AccountActivation from "@components/emails/account-activation";
import NewJobNotification from "@components/emails/new-job-notification";
import JobCompletion from "@components/emails/job-completion";
import AccountDeactivationWarning from "@components/emails/account-deactivation-warning";
import SubscriptionRenewalReminder from "@components/emails/subscription-renewal-reminder";

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
