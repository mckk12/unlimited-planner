import { memo, type FC, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { availabilityService } from "../../services/supabaseClient";

type AvailabilityStatus = "available" | "unavailable" | "not-set";

const getAvailabilityStatus = async (userId: string, dateStrings: string[]): Promise<AvailabilityStatus> => {
    try {
        const data = await availabilityService.getUserAvailabilities(userId, dateStrings);
        if (!data || data.length === 0) return "not-set";

        const availabilityArray = data as Array<{ date: string; availability: { canGo?: number[]; maybe?: number[] } }>;
        
        // Check if all dates have no availability (unavailable everywhere)
        const allUnavailable = availabilityArray.every(item => 
            (!item.availability?.canGo || item.availability.canGo.length === 0) &&
            (!item.availability?.maybe || item.availability.maybe.length === 0)
        );

        if (allUnavailable) return "unavailable";
        return "available";
    } catch (error) {
        console.error("Error fetching availability:", error);
        return "not-set";
    }
};

type ParticipantAvailabilityIconProps = {
    participantId: string;
    currentWeekDates?: string[];
};

const ParticipantAvailabilityIcon: FC<ParticipantAvailabilityIconProps> = ({ participantId, currentWeekDates }) => {
    const [status, setStatus] = useState<AvailabilityStatus>("not-set");
    const [loading, setLoading] = useState(() => currentWeekDates ? currentWeekDates.length > 0 : false);

    useEffect(() => {
        if (!currentWeekDates || currentWeekDates.length === 0) {
            return;
        }

        let cancelled = false;

        getAvailabilityStatus(participantId, currentWeekDates).then(result => {
            if (!cancelled) {
                setStatus(result);
                setLoading(false);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [participantId, currentWeekDates]);

    if (loading) {
        return <FontAwesomeIcon icon={faCircle} className="text-gray-400" aria-label="Loading..." />;
    }

    if (status === "available") {
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" aria-label="Participant set availability" />;
    }

    if (status === "unavailable") {
        return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500" aria-label="Participant unavailable this week" />;
    }

    return <FontAwesomeIcon icon={faCircle} className="text-gray-500" aria-label="Participant hasn't set availability" />;
};

export default memo(ParticipantAvailabilityIcon);
