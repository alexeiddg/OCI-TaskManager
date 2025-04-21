package enums;

import com.fasterxml.jackson.annotation.JsonFormat;

@JsonFormat(shape = JsonFormat.Shape.STRING)
public enum KpiType {
    SPRINT_VELOCITY,
    SPRINT_COMPLETION_RATE,
    BUGS_VS_FEATURES_RATIO,
    EFFICIENCY_SCORE,
    WORKLOAD_BALANCE,
    AVERAGE_COMPLETION_TIME
}
