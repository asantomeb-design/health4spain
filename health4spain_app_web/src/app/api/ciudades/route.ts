import { NextResponse } from 'next/server';
import { getCiudades } from '@/lib/ciudades';

export async function GET() {
  try {
    const ciudades = await getCiudades();
    const opciones = [
      ...ciudades.map((c) => ({ value: c.slug, label: c.nombre })),
      { value: 'otra', label: 'Otra ciudad' },
    ];
    return NextResponse.json(opciones);
  } catch (error) {
    console.error('Error fetching ciudades:', error);
    return NextResponse.json([], { status: 500 });
  }
}
