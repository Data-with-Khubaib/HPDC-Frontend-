// Helper Function:
export function formatDate(dateVal) {
    if (!dateVal) return '-';
    // Agar timestamp Unix format mein hai (e.g. 1788159918)
    const timestamp = Number(dateVal);
    const dateObj = !isNaN(timestamp)
        ? new Date(timestamp * (timestamp > 1e10 ? 1 : 1000))
        : new Date(dateVal);

    return dateObj.toISOString().split('T')[0]; // Returns "2026-08-31"
}
