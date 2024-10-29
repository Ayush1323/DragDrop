
export const PER_PAGE_OPTIONS = [6, 12, 18, 24];

const DATA = [
    {
        id: "0e2f0db1-5457-46b0-949e-8032d2f9997a",
        name: "In progress",
        items: Array.from({ length: 20000 }, (v, i) => ({
            id: crypto.randomUUID(),
            name: `TASK ${i + 1}`
        })),
        tint: 1,
        color: "text-[#2b83de]",
        border: "border-[#2b83de]",
    },   
    {
        id: "487f68b4-1746-438c-920e-d67b7df46247",
        name: "To Do",
        items: Array.from({ length: 20000 }, (v, i) => ({
            id: crypto.randomUUID(),
            name: `TASK ${i + 1}`
        })),
        tint: 2,
        color: "text-[#f7a23a]",
        border: "border-[#f7a23a]",
    },
    {
        id: "25daffdc-aae0-4d73-bd31-43f73101e7c0",
        name: "In Review",
        items: Array.from({ length: 20000 }, (v, i) => ({
            id: crypto.randomUUID(),
            name: `TASK ${i + 1}`
        })),
        tint: 3,
        color: "text-[#e23333]",
        border: "border-[#e23333]",
    },
    {
        id: "b2ad2d6f-b8cb-4ed9-85af-2b6c1b7f9a60",
        name: "Ready For QA",
        items: Array.from({ length: 20000 }, (v, i) => ({
            id: crypto.randomUUID(),
            name: `TASK ${i + 1}`
        })),
        tint: 4,
        color: "text-[#7ec451]",
        border: "border-[#7ec451]",
    },
    {
        id: "d9c3f4e8-ec62-4631-a0a0-3742c1e83967",
        name: "Closed",
        items: [
            { id: "e0d987d7-0c6e-4aa8-973b-086f10d659a0", name: "TASK 9" },
            { id: "fd0bc1d1-1e4b-4909-8348-b9bcf83b8c84", name: "TASK 10" },
        ],
        tint: 5,
        color: "text-[#696969]",
        border: "border-[#696969]",
    },
];
export const initialProjects = [
    {
        id: 1,
        name: "CheckMyGuest | Hire",
        created: "1 year ago",
        tag: "#CHEH",
        color: "bg-red-200",
        data: DATA

    },
    {
        id: 2,
        name: "Passio | Hire",
        created: "2 years ago",
        tag: "#PASS",
        color: "bg-blue-200",
        data: DATA
    },
    {
        id: 3,
        name: "Retrun | Hire",
        created: "1 month ago",
        tag: "#RETI",
        color: "bg-green-200",
        data: DATA
    },
    {
        id: 4,
        name: "Navatech (Neom) | Hire",
        created: "1 year ago",
        tag: "#NEOM",
        color: "bg-yellow-200",
        data: DATA
    },
    {
        id: 5,
        name: "Karlos | Fix",
        created: "2 months ago",
        tag: "#KARL",
        color: "bg-indigo-200",
        data: DATA
    },
    {
        id: 6,
        name: "Test Aryan | Bucket",
        created: "3 months ago",
        tag: "#TESB",
        color: "bg-purple-200",
        data: DATA
    },
    {
        id: 7,
        name: "Dedicated ",
        created: "7 months ago",
        tag: "#DEDR",
        color: "bg-pink-200",
        data: DATA
    },
    {
        id: 8,
        name: "CollabCRM | Inhouse",
        created: "9 months ago",
        tag: "#COLLAB",
        color: "bg-teal-200",
        data: DATA
    },
];