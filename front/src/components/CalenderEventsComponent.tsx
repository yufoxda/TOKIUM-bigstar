import useCalendar from '../hooks/useCalendar';

// 仮コンポーネントです。良い感じに書き換えてください
const CalenderEventsComponent = ({userId, token}) => {
    const {events, loading, error} = useCalendar();

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <h1>Events</h1>
            <ul>
                {events.map((event) => (
                    <li key={event.id}>{event.summary}, {event.location}</li>

                ))}
            </ul>
        </div>
    );
}
export default CalenderEventsComponent;