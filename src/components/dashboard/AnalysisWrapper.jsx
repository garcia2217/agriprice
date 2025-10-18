import React, { useEffect } from "react";
import { useAnalysis } from "../../context/AnalysisContext";

const AnalysisWrapper = ({ analysisId, children }) => {
    const { setAnalysisId } = useAnalysis();

    useEffect(() => {
        if (analysisId) {
            setAnalysisId(analysisId);
        }
    }, [analysisId, setAnalysisId]);

    return children;
};

export default AnalysisWrapper;
