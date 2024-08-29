import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { useCsrf } from './useCsrf';

interface CalenderEventItems{
    id: string;
    summary: string;
    location: string;
    description: string;
    start: string;
    end: string;
}
interface CalenderEvents{
    events: CalenderEventItems[];
    loading: boolean;
    error: any;
}

const useCalendar = () => {
    const [events, setEvents] = useState<CalenderEvents>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser, token } = useAuth();
    const { csrfToken } = useCsrf();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // `GET` メソッドを使用
                const response = await axios.get(`http://localhost:3000/api/v1/calendar/events/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'X-CSRF-Token': csrfToken,
                    },
                    params: {
                        user_id: currentUser.id
                    }
                });
                const sortedEvents = response.data.sort((a: any, b: any) => {
                    return new Date(b.start).getTime() - new Date(a.start).getTime();
                });
                setEvents(sortedEvents);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        // ユーザー ID とトークンが存在する場合に fetchEvents を実行
        if (currentUser.id && token) {
            fetchEvents();
        }
    }, [currentUser.id, token, csrfToken]);

    return { events, loading, error };
};

export default useCalendar;
