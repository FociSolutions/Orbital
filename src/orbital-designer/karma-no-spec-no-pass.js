module.exports = {
    'reporter:no-spec-no-pass': ['type', function (config) {
        this.onSpecComplete = (_browser, result) => {
            if (result.executedExpectationsCount === 0 && console && console.error) {
                let message = 'Spec \'' + result.fullName + '\' has no expectations; aborting tests.';
                console.error(message);
                if (config.reporters.includes('@angular-devkit/build-angular--event-reporter')) {
                    process.exit(1)
                } else {
                    throw new Error(message)
                }
            }
        }
    }]
}