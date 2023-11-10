let id = 0;

export default function getId(){
    return id++
}

export function idGenerator() {
    let i = 0;
    return () => i++;
}