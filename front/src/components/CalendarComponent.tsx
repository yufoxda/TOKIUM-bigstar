import { useState } from 'react';
import { useCalendar } from '../hooks/useCalendar';

const CalendarComponent = () => {
    const {events, loading, error} = useCalendar();
    const [isOverlay, setIsOverlay] = useState<boolean>(false);

    const showOverlay = () => {
        setIsOverlay(true);
    }
    const hideOverlay = () => {
        setIsOverlay(false);
    }

    return (
        <div>
            {isOverlay && loading && <p>Loading...</p>}
            {isOverlay && error && <p>Error: {error.message}</p>}
            {isOverlay && (
                <div>
                    <button  type="button" onClick={hideOverlay} className="bg-red-500 text-white">閉じる</button>
                    <p>該当するイベントを押して直接入力ができます(未実装)</p>
                    {events.map((event) => (
                        <button key={event.id} className="bg-blue-400 text-white">{formatDateToJapanese(event.start)}, {event.summary}, {event.location}</button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CalendarComponent;