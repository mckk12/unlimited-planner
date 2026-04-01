import { memo, type FC } from "react";
import { type User } from "../../utils/types";
import ParticipantAvailabilityIcon from "./ParticipantAvailabilityIcon";

type PlannerParticipantsSectionProps = {
    participants: User[];
    canManageParticipants: boolean;
    currentUserId?: string;
    onCopyCcNumber: (ccnumber?: string | null) => void;
    onRemoveParticipant: (participantId: string) => void;
    currentWeekDates?: string[];
};

const PlannerParticipantsSection: FC<PlannerParticipantsSectionProps> = ({
    participants,
    canManageParticipants,
    currentUserId,
    onCopyCcNumber,
    onRemoveParticipant,
    currentWeekDates,
}) => {
    return (
        <section>
            <h2 className="mb-4 mt-6 text-lg font-semibold text-slate-100">Participants</h2>
            <div className="space-y-2">
                {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2">
                        <ParticipantAvailabilityIcon participantId={participant.id} currentWeekDates={currentWeekDates} />
                        <span className="text-sm text-slate-200">
                            {participant.username}{" "}
                            {participant.ccnumber ? (
                                <button
                                    type="button"
                                    onClick={() => onCopyCcNumber(participant.ccnumber)}
                                    className="cursor-pointer rounded px-1 text-cyan-300 underline-offset-2 transition-colors hover:text-cyan-200 hover:underline"
                                    title="Click to copy ccnumber"
                                >
                                    ({participant.ccnumber})
                                </button>
                            ) : (
                                ""
                            )}
                        </span>
                        {canManageParticipants && participant.id !== currentUserId && (
                            <button
                                type="button"
                                onClick={() => onRemoveParticipant(participant.id)}
                                className="ml-auto rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-red-500"
                            >
                                Kick
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default memo(PlannerParticipantsSection);