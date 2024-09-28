export async function fetchResults(url, data) {
    console.log(data);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const output = await response.json();
        return output;
    }
    catch (error) {
        throw new Error(error);
    }
}
export async function fetchApi(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
//# sourceMappingURL=api.js.map