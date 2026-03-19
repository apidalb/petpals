import Link from 'next/link'
import type { Pet } from '@/types'

interface PetCardProps {
  pet: Pet
}

export default function PetCard({ pet }: PetCardProps) {
  const statusLabel =
    pet.status === 'Available'  ? '● Available'   :
    pet.status === 'Adopted'    ? '✓ Adopted'      :
                                  '⏳ In Process'

  const statusClass =
    pet.status === 'Available'  ? 'available' :
    pet.status === 'Adopted'    ? 'adopted'   :
                                  'process'

  return (
    <Link href={`/pets/${pet.id}`} style={{ textDecoration: 'none' }}>
      <div className="pet-card">
        <div className="pet-card-img-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pet.img}
            alt={pet.name}
            className="pet-card-img"
            loading="lazy"
          />
          <span className="pet-card-badge">{pet.type}</span>
          <span className={`pet-card-status ${statusClass}`}>{statusLabel}</span>
        </div>
        <div className="pet-card-body">
          <div className="pet-card-name">{pet.name}</div>
          <div className="pet-card-meta">
            <span style={{ marginRight: '4px' }}>{pet.age}</span>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ marginLeft: '4px' }}>{pet.location}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
