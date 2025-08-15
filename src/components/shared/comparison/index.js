// Testimonial Components
export { TestimonialCard, TestimonialSection } from "./testimonial-card";

// ROI Calculator Components
export { ROICalculator, ServiceBusinessROI, TravelBusinessROI } from "./roi-calculator";

// Interactive Demo Components
export { InteractiveDemo, ServiceBusinessDemo, TravelBusinessDemo, RestaurantBusinessDemo } from "./interactive-demo";

// Comparison Table Components
export { ComparisonTable, ServicePlatformComparison, TravelPlatformComparison, RestaurantPlatformComparison } from "./comparison-table";

// CTA Section Components
export { CTASection, ServiceBusinessCTA, TravelBusinessCTA, RestaurantBusinessCTA, GeneralBusinessCTA } from "./cta-section";

// Detailed Analysis Components
export { DetailedAnalysis, ServicePlatformAnalysis, TravelPlatformAnalysis, RestaurantPlatformAnalysis } from "./detailed-analysis";

// Example usage patterns for documentation:

/*
// Basic testimonial usage:
import { TestimonialCard, TestimonialSection } from '@components/shared/comparison';

<TestimonialSection 
	title="Customer Success Stories" 
	subtitle="Real businesses that switched to Thorbis"
>
	<TestimonialCard
		businessType="HVAC Contractor"
		metric={{ value: "+234%", label: "Lead Quality Increase" }}
		quote="Amazing results with qualified leads..."
		customer={{ name: "John Smith", business: "Smith HVAC" }}
		icon={Wrench}
		avatarIcon={Building}
	/>
</TestimonialSection>

// Service business ROI calculator:
import { ServiceBusinessROI } from '@components/shared/comparison';

<ServiceBusinessROI 
	competitorName="Bark"
	competitorCommission="20"
	totalSavings="$230,052"
/>

// Travel business demo:
import { TravelBusinessDemo } from '@components/shared/comparison';

<TravelBusinessDemo businessType="Hotel" />

// Comparison table:
import { ServicePlatformComparison } from '@components/shared/comparison';

<ServicePlatformComparison competitorName="Angie's List" />

// Enhanced CTA:
import { ServiceBusinessCTA } from '@components/shared/comparison';

<ServiceBusinessCTA 
	competitorName="Bark"
	totalSavings="$230K+"
/>

// Detailed Analysis:
import { ServicePlatformAnalysis } from '@components/shared/comparison';

<ServicePlatformAnalysis competitorName="Bark" />
*/
