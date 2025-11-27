module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "\\.(scss|css)$": "identity-obj-proxy"
    },
    setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"]
};
