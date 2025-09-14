/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin';
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,jsx}',
		'./components/**/*.{js,jsx}',
		'./app/**/*.{js,jsx}',
		'./src/**/*.{js,jsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
                        colors: {
                                border: 'hsl(var(--border))',
                                input: 'hsl(var(--input))',
                                ring: 'hsl(var(--ring))',
                                background: 'hsl(var(--background))',
                                foreground: 'hsl(var(--foreground))',
                                blue: {
                                        DEFAULT: '#2e3192',
                                        50: '#2e3192',
                                        100: '#2e3192',
                                        200: '#2e3192',
                                        300: '#2e3192',
                                        400: '#2e3192',
                                        500: '#2e3192',
                                        600: '#2e3192',
                                        700: '#2e3192',
                                        800: '#2e3192',
                                        900: '#2e3192',
                                },
                                primary: {
                                        DEFAULT: 'hsl(var(--primary))',
                                        foreground: 'hsl(var(--primary-foreground))',
                                },
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
                        keyframes: {
                                'accordion-down': {
                                        from: { height: 0 },
                                        to: { height: 'var(--radix-accordion-content-height)' },
                                },
                                'accordion-up': {
                                        from: { height: 'var(--radix-accordion-content-height)' },
                                        to: { height: 0 },
                                },
                                'scroll-right': {
                                        '0%': { transform: 'translateX(0)' },
                                        '100%': { transform: 'translateX(-50%)' },
                                },
                                'scroll-left': {
                                        '0%': { transform: 'translateX(0)' },
                                        '100%': { transform: 'translateX(50%)' },
                                },
                        },
                        animation: {
                                'accordion-down': 'accordion-down 0.2s ease-out',
                                'accordion-up': 'accordion-up 0.2s ease-out',
                                'scroll-right': 'scroll-right 40s linear infinite',
                                'scroll-left': 'scroll-left 40s linear infinite',
                        },
		},
	},
        plugins: [
                tailwindcssAnimate,
                plugin(function({ addVariant }) {
                        addVariant('rtl', '&[dir="rtl"] &, [dir="rtl"] &');
                        addVariant('ltr', '&[dir="ltr"] &, [dir="ltr"] &');
                })
        ],
};
