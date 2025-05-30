<!-- Generated by SpecStory -->

# Adjusting ESLint Settings for Flexibility (2025-04-19 17:56:23)

_**User**_

change the eslint settings to less strict one

---

_**Assistant**_



---

I'll update the ESLint configuration to be less strict by modifying some rules.

---

```diff
      "next/core-web-vitals",
      "next/typescript"
-   ]
+   ],
+   "rules": {
+     "react/react-in-jsx-scope": "off",
+     "react/prop-types": "off",
+     "no-unused-vars": "warn",
+     "@typescript-eslint/no-unused-vars": "warn",
+     "@typescript-eslint/no-explicit-any": "warn",
+     "@typescript-eslint/explicit-module-boundary-types": "off",
+     "@typescript-eslint/no-non-null-assertion": "off",
+     "prefer-const": "warn",
+     "no-console": "warn"
+   }
  }
  
```

---

Updated the ESLint configuration with more relaxed rules:

- Turned off React-specific rules that are no longer needed in modern React
- Changed strict errors to warnings for common issues like unused variables and any types
- Disabled TypeScript boundary type enforcement and non-null assertions
- Set less severe "warn" level for console statements and const usage

These changes maintain code quality while being more forgiving during development.

---

_**User**_

For the code present, we get this error:
```
'setIsSupported' is declared but its value is never read.
```
How can I resolve this? If you propose a fix, please make it concise.

---

_**Assistant**_



---

