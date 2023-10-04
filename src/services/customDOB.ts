export const yearOptions = () => {
    const maxYear = new Date().getFullYear() - 110;
    const minYear = new Date().getFullYear() - 13;
    let years = [];
    for (let i = maxYear; i <= minYear; i++) {
        years = [i, ...years];
    }
    return years;
};

export const monthOptions = () => {
    let months = [
        {
            name: "January",
            key: 1,
        },
        {
            name: "February",
            key: 2,
        },
        {
            name: "March",
            key: 3,
        },
        {
            name: "April",
            key: 4,
        },
        {
            name: "May",
            key: 5,
        },
        {
            name: "June",
            key: 6,
        },
        {
            name: "July",
            key: 7,
        },
        {
            name: "August",
            key: 8,
        },
        {
            name: "September",
            key: 9,
        },
        {
            name: "October",
            key: 10,
        },
        {
            name: "November",
            key: 11,
        },
        {
            name: "December",
            key: 12,
        },
    ];

    return months;
};

// Generate options for the date select input based on the selected month and year
export const dateOptions = (year, month) => {
    const maxDate = new Date(year, month, 0).getDate();
    let dates = [];
    for (let i = 1; i <= maxDate; i++) {
        dates = [...dates, i];
    }
    return dates;
};