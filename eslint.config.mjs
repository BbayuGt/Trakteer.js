import tseslint from "typescript-eslint";

export default tseslint.config({
	files: ["src/**/*.ts"],
	rules: {
		"@typescript-eslint/no-explicit-any": "warn"
	},
	
})
