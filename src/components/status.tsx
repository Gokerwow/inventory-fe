// Define the logic maps here
const STATUS_STYLES = {
    paid: "bg-success text-white", // uses var(--color-success) from index.css
    unpaid: "bg-warning text-white",
    pending: "bg-gray-400 text-white"
};

export default function Status({ text }: { text: string }) {
    // Determine variant based on text content automatically
    let variant = 'pending';

    const lowerText = text.toLowerCase();
    if (lowerText.includes('telah dibayar') || lowerText.includes('lunas')) {
        variant = 'paid';
    } else if (lowerText.includes('belum') || lowerText.includes('menunggu')) {
        variant = 'unpaid';
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[variant]}`}>
            {text}
        </span>
    );
}