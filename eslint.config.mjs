// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,
	{
		rules: {
			'array-callback-return': 'error',
			'block-scoped-var': 'error',
			'block-spacing': 'error',
			'brace-style': 'error',
			'comma-dangle': 'error',
			'comma-spacing': 'error',
			'comma-style': 'error',
			'complexity': 'off',
			'consistent-return': 'error',
			'curly': 'error',
			'default-case': 'error',
			'dot-notation': 'error',
			'eol-last': 'error',
			'eqeqeq': 'error',
			'indent': [
				'error',
				'tab',
				{
					'SwitchCase': 1
				}
			],
			'jsx-quotes': ['error', 'prefer-single'],
			'key-spacing': 'error',
			'keyword-spacing': 'error',
			'max-depth': 'off',
			'max-len': 'off',
			'max-nested-callbacks': 'warn',
			'max-params': [
				'warn',
				{
					'max': 5
				}
			],
			'max-statements': 'off',
			'no-class-assign': 'off',
			'no-console': 'off',
			'no-duplicate-imports': 'warn',
			'no-empty-function': 'error',
			'no-extra-bind': 'error',
			'no-extra-label': 'error',
			'no-floating-decimal': 'error',
			'no-implicit-coercion': 'error',
			'no-invalid-this': 'error',
			'no-labels': 'error',
			'no-mixed-operators': 'error',
			'no-multi-spaces': 'error',
			'no-multi-str': 'error',
			'no-multiple-empty-lines': [
				'error',
				{
					'max': 1,
					'maxBOF': 0
				}
			],
			'no-new': 'error',
			'no-new-func': 'error',
			'no-new-wrappers': 'error',
			'no-octal-escape': 'error',
			'no-param-reassign': 'error',
			'no-plusplus': [
				'error',
				{
					'allowForLoopAfterthoughts': true
				}
			],
			'no-self-compare': 'error',
			'no-shadow': 'error',
			'no-throw-literal': 'error',
			'no-underscore-dangle': 'off',
			'no-useless-concat': 'error',
			'no-useless-constructor': 'error',
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'object-shorthand': 'error',
			'one-var': [
				'error',
				'never'
			],
			'operator-linebreak': 'error',
			'prefer-const': [
				'error',
				{
					'destructuring': 'any',
					'ignoreReadBeforeAssign': false
				}
			],
			'prefer-rest-params': 'error',
			'prefer-template': 'error',
			'quotes': [
				'error',
				'single',
				{
					'avoidEscape': true
				}
			],
			'semi': [
				'error',
				'never'
			],
			'space-before-function-paren': [
				'error',
				{
					'anonymous': 'always',
					'asyncArrow': 'always',
					'named': 'never'
				}
			],
			'space-infix-ops': 'error',
			'no-return-await': 'error',

			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					'args': 'all',
					'argsIgnorePattern': '^_',
					'caughtErrors': 'all',
					'caughtErrorsIgnorePattern': '^_',
					'destructuredArrayIgnorePattern': '^_',
					'varsIgnorePattern': '^_',
					'ignoreRestSiblings': true
				}
			],
			'@typescript-eslint/no-non-null-assertion': 'off',
			// '@typescript-eslint/member-delimiter-style': [
			// 		'error',
			// 		{
			// 			'multiline': {
			// 				'delimiter': 'none'
			// 			},
			// 			'singleline': {
			// 				'delimiter': 'comma',
			// 				'requireLast': false
			// 			}
			// 		}
			// 	],
			'@typescript-eslint/consistent-type-definitions': [
				'error',
				'type'
			]
		}
	}
)
