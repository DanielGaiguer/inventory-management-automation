"use client"

import { useEffect, useState } from "react"

interface itemProtocol {
  id: number
  name: string,
  quantity: number
}

export default function Home() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetch("/api/items")
      .then(res => res.json())
      .then(setItems)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Itens</h1>

      <ul className="mt-4 space-y-2">
        {items.map((item: itemProtocol) => (
          <li key={item.id} className="border p-2 rounded">
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  )
}
