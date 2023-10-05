
export function daysDifference(date) {
    try {
        const today = new Date();
        var diff = new Date(+today).setHours(12) - new Date(+date).setHours(12);
        return Math.round(diff / 8.64e7);
    } catch (error) {
        //openNotification("Wrong Date format", "error");
    }
}

export const extract_day = (date, week_day_name_keep = false) => {
    const val = daysDifference(date);
    const week_days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
    ];
    if (!week_day_name_keep) {
        if (val === 0) {
            return "Today";
        }

        if (val === 1) {
            return "Yesterday";
        }

        if (val >= 2 && val < 8) {
            try {
                return week_days[date.getDay()];
            } catch (error) {
            }
        }

        if (val >= 8) {
            try {
                return `${months[date.getMonth()]} ${
                    date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
                }, ${date.getFullYear()}`;
            } catch (error) {
            }
        }
    } else {
        try {
            return `${months[date.getMonth()]} ${
                date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
            }, ${date.getFullYear()}`;
        } catch (error) {
        }
    }
};