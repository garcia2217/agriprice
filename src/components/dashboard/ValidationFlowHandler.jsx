import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";

const ValidationFlowHandler = ({
    validationResult,
    onValidatedAnalysis,
    onReupload,
    onClear,
}) => {
    const { actions } = useAnalysis();

    // Handle validation result when it changes
    React.useEffect(() => {
        if (validationResult) {
            actions.handleValidationResult(validationResult);
            // Clear the pending result after handling
            onClear?.();
        }
    }, [validationResult, actions, onClear]);

    return null; // This component only handles side effects
};

export default React.memo(ValidationFlowHandler);
