import React from "react";
import { useAnalysis } from "../../context/AnalysisContext";
import ValidationErrorModal from "../modals/ValidationErrorModal";
import ValidationConfigModal from "../modals/ValidationConfigModal";

const ValidationHandler = ({ onValidatedAnalysis, onReupload, isLoading }) => {
    const { validationResult, showValidationModal, showErrorModal, actions } =
        useAnalysis();

    const handleReupload = () => {
        actions.closeErrorModal();
        actions.setSelectedFile(null);
        onReupload?.();
    };

    return (
        <>
            {showValidationModal && (
                <ValidationConfigModal
                    validationResult={validationResult}
                    onConfirm={onValidatedAnalysis}
                    onCancel={() => actions.closeValidationModal()}
                    isLoading={isLoading}
                />
            )}

            {showErrorModal && (
                <ValidationErrorModal
                    validationResult={validationResult}
                    onClose={() => actions.closeErrorModal()}
                    onReupload={handleReupload}
                />
            )}
        </>
    );
};

export default React.memo(ValidationHandler);
