export const siteContent = {
	meta: {
		title: 'Apartment Security',
		description:
			'Apartment security patrol, camera monitoring, controlled access, and emergency response services.',
	},
	brand: {
		badge: 'S',
		name: 'Apartment Security',
	},
	hero: {
		headline: 'Eagle Security Guard Services',
		lead:
			'From gate access control to mobile patrols and overnight response, we help multifamily communities lower incident risk and increase resident trust.',
		pills: [
			'24/7 Patrol Options',
			'Camera Monitoring',
			'Incident Reporting',
			'Access Control',
		],
		metrics: [
			{ value: '10 min', label: 'average alarm response' },
			{ value: '98%', label: 'shift coverage reliability' },
			{ value: 'Same day', label: 'service quote turnaround' },
		],
	},
	form: {
		title: 'Request more information',
		messageLabel: 'Tell us what you need',
		messagePlaceholder:
			'Example: We need evening patrol coverage for a 120-unit property with frequent parking lot incidents.',
		submitLabel: 'Send Inquiry',
		footerNote: 'Messages are sent directly to the business owner email.',
		status: {
			sending: 'Sending your inquiry...',
			success: 'Thanks! We will reach out shortly.',
			errorFallback: 'Submission failed. Please try again.',
		},
	},
	design: {
		preset: 'Default',
		overrides: {
			ink: '#0a0f1e',            // darkest text — very dark navy
			slate: '#8896b3',          // secondary/body text — muted steel blue
			primary: '#3a6cd9',        // buttons, badges, pills — clear authority blue
			primaryDeep: '#1e3a8a',    // button hover, deeper blue
			accent: '#020101',         // highlight color — gold for contrast
			card: 'rgba(255, 255, 255, 0.85)', // card panels — dark navy glass
			backgroundTop: '#0d1b3e',  // top of page gradient — deep navy
			backgroundBottom: '#071029', // bottom of page gradient — near-black navy
			glowPrimary: 'rgba(37, 99, 235, 0.25)', // blue glow behind cards
			glowAccent: 'rgba(30, 28, 25, 0.15)',  // gold glow accent
		},
	},
	widgets: {
		showBadge: true,
		showFeaturePills: true,
		showMetrics: true,
		useCardAnimation: true,
	},
};
