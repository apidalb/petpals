'use client'

import { useEffect, useState } from 'react'
import type { Pet, PetStatus, PetType } from '@/types'
import { useToast } from '@/context/ToastContext'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { createClient } from '@/lib/supabase/client'
import { PET_IMAGES_BUCKET } from '@/lib/supabase/storage'

type DbPet = {
  id: string
  name: string | null
  type: string | null
  breed: string | null
  age_years: number | null
  status: string | null
  image_url: string | null
  description: string | null
}

function mapDbPetToPet(row: DbPet): Pet {
  const type =
    row.type === 'Dog' || row.type === 'Cat' || row.type === 'Bird' || row.type === 'Reptile'
      ? row.type
      : 'Reptile'
  const status =
    row.status === 'Available' || row.status === 'Adopted' || row.status === 'In Process'
      ? row.status
      : 'Available'

  return {
    id: row.id,
    name: row.name ?? 'Unnamed Pet',
    type,
    breed: row.breed ?? '-',
    age: row.age_years != null ? `${row.age_years} years` : '-',
    gender: 'Unknown',
    weight: '-',
    location: 'Unknown',
    status,
    vaccinated: false,
    neutered: false,
    img: row.image_url ?? '/login-dog.png',
    desc: row.description ?? 'No description yet.',
  }
}

function getAgeYears(age: string): number | null {
  const parsed = parseInt(age, 10)
  return Number.isFinite(parsed) ? parsed : null
}

export default function AdminAnimalsPage() {
  const { showToast } = useToast()
  const [pets, setPets]       = useState<Pet[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editPet, setEditPet]     = useState<Pet | null>(null)
  const [deleteId, setDeleteId]   = useState<number | string | null>(null)
  const [saving, setSaving]       = useState(false)

  // Form state
  const emptyForm = { name: '', type: 'Dog' as PetType, breed: '', age: '', gender: 'Male', weight: '', location: 'Semarang', status: 'Available' as PetStatus, vaccinated: false, neutered: false, img: '', desc: '' }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    const fetchPets = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('pets')
        .select('id, name, type, breed, age_years, status, image_url, description')
        .order('created_at', { ascending: false })

      if (error || !data) {
        setPets([])
        showToast('Gagal memuat data hewan dari server.', 'err')
        return
      }

      setPets(data.map(mapDbPetToPet))
    }

    fetchPets()
  }, [showToast])

  const openAdd = () => { setEditPet(null); setForm(emptyForm); setShowModal(true) }
  const openEdit = (p: Pet) => { setEditPet(p); setForm({ ...p }); setShowModal(true) }

  const handleSave = async () => {
    if (!form.name.trim() || !form.breed.trim()) { showToast('Nama dan breed wajib diisi.', 'err'); return }
    setSaving(true)
    const supabase = createClient()

    if (editPet) {
      const { error } = await supabase
        .from('pets')
        .update({
          name: form.name,
          type: form.type,
          breed: form.breed,
          age_years: getAgeYears(form.age),
          status: form.status,
          image_url: form.img || null,
          description: form.desc || null,
        })
        .eq('id', String(editPet.id))

      if (error) {
        showToast('Gagal memperbarui data hewan.', 'err')
        setSaving(false)
        return
      }

      setPets(prev => prev.map(p => p.id === editPet.id ? { ...form, id: editPet.id } : p))
      showToast(`Data ${form.name} berhasil diperbarui.`, 'ok')
    } else {
      const { data, error } = await supabase
        .from('pets')
        .insert({
          name: form.name,
          type: form.type,
          breed: form.breed,
          age_years: getAgeYears(form.age),
          status: form.status,
          image_url: form.img || null,
          description: form.desc || null,
        })
        .select('id, name, type, breed, age_years, status, image_url, description')
        .single()

      if (error || !data) {
        showToast('Gagal menambahkan hewan baru.', 'err')
        setSaving(false)
        return
      }

      setPets(prev => [mapDbPetToPet(data), ...prev])
      showToast(`${form.name} berhasil ditambahkan.`, 'ok')
    }

    setSaving(false)
    setShowModal(false)
  }

  const handleDelete = async (id: number | string) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('pets')
      .delete()
      .eq('id', String(id))

    if (error) {
      showToast('Gagal menghapus data hewan.', 'err')
      setDeleteId(null)
      return
    }

    setPets(prev => prev.filter(p => p.id !== id))
    setDeleteId(null)
    showToast('Data hewan berhasil dihapus.', 'ok')
  }

  const statusColors: Record<PetStatus, string> = {
    'Available':  'var(--teal)',
    'Adopted':    'var(--text-muted)',
    'In Process': 'var(--yellow)',
  }

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--white)', letterSpacing: '-0.03em', marginBottom: '4px' }}>Animals</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '.875rem' }}>{pets.length} hewan terdaftar</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Tambah Hewan</button>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Animal', 'Type', 'Age', 'Status', 'Vaccinated', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pets.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--white)' }}>{p.name}</div>
                      <div style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>{p.breed}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '.85rem', color: 'var(--text-muted)' }}>{p.type}</td>
                <td style={{ padding: '14px 16px', fontSize: '.85rem', color: 'var(--text-muted)' }}>{p.age}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: '.75rem', fontWeight: 600, color: statusColors[p.status] }}>{p.status}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '.85rem', color: p.vaccinated ? 'var(--teal)' : 'var(--text-dim)' }}>
                  {p.vaccinated ? '✅' : '—'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '5px 12px', fontSize: '.78rem' }} onClick={() => openEdit(p)}>Edit</button>
                    <button
                      style={{ padding: '5px 12px', fontSize: '.78rem', borderRadius: '8px', border: '1px solid rgba(248,113,113,.3)', background: 'rgba(248,113,113,.08)', color: 'var(--red)', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}
                      onClick={() => setDeleteId(p.id)}
                    >Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-2)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--white)', marginBottom: '20px' }}>
              {editPet ? `Edit ${editPet.name}` : 'Tambah Hewan Baru'}
            </h2>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Nama *</label>
                <input className="f-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama hewan" />
              </div>
              <div className="f-group">
                <label className="f-label">Breed *</label>
                <input className="f-input" value={form.breed} onChange={e => setForm(f => ({ ...f, breed: e.target.value }))} placeholder="Ras/jenis" />
              </div>
            </div>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Jenis</label>
                <select className="f-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as PetType }))}>
                  {['Dog', 'Cat', 'Bird', 'Reptile'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="f-group">
                <label className="f-label">Gender</label>
                <select className="f-select" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                  <option>Male</option><option>Female</option>
                </select>
              </div>
            </div>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Umur</label>
                <input className="f-input" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="2 years" />
              </div>
              <div className="f-group">
                <label className="f-label">Berat</label>
                <input className="f-input" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} placeholder="10 kg" />
              </div>
            </div>
            <div className="f-row">
              <div className="f-group">
                <label className="f-label">Status</label>
                <select className="f-select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as PetStatus }))}>
                  <option>Available</option><option>Adopted</option><option>In Process</option>
                </select>
              </div>
              <div className="f-group">
                <label className="f-label">Lokasi</label>
                <input className="f-input" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
              </div>
            </div>
            <div className="f-group">
              <label className="f-label">URL Foto</label>
              <input className="f-input" value={form.img} onChange={e => setForm(f => ({ ...f, img: e.target.value }))} placeholder="https://..." />
              <p style={{ marginTop: '6px', fontSize: '.74rem', color: 'var(--text-dim)' }}>
                Storage bucket siap: <strong>{PET_IMAGES_BUCKET}</strong>
              </p>
            </div>
            <div className="f-group">
              <label className="f-label">Deskripsi</label>
              <textarea className="f-textarea" rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.vaccinated} onChange={e => setForm(f => ({ ...f, vaccinated: e.target.checked }))} style={{ accentColor: 'var(--teal)' }} />
                Vaccinated
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '.85rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.neutered} onChange={e => setForm(f => ({ ...f, neutered: e.target.checked }))} style={{ accentColor: 'var(--teal)' }} />
                Neutered
              </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Menyimpan...' : editPet ? 'Simpan Perubahan' : 'Tambah Hewan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId !== null && (
        <ConfirmModal
          title="Hapus Hewan"
          message="Apakah kamu yakin ingin menghapus data hewan ini? Tindakan ini tidak bisa dibatalkan."
          onConfirm={() => handleDelete(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  )
}
