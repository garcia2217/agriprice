import React, { useMemo, useState } from "react";
import AlgorithmComparisonTable from "./AlgorithmComparisonTable";
import ClusterMembersTable from "./ClusterMembersTable";

const ComparisonContainer = ({ data }) => {
    const algorithms = useMemo(
        () => Object.keys(data?.algorithm_results || {}),
        [data]
    );
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[0]);

    return (
        <div className="space-y-8">
            <div>
                <AlgorithmComparisonTable
                    algorithmResults={data?.algorithm_results}
                />
            </div>
            <div>
                <ClusterMembersTable
                    algorithmResults={data?.algorithm_results}
                    selectedAlgorithm={selectedAlgorithm}
                    onAlgorithmChange={setSelectedAlgorithm}
                />
            </div>
        </div>
    );
};

export default React.memo(ComparisonContainer);
