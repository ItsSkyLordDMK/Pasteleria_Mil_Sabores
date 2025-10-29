import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { getOrders } from '../../utils/orders';

export default function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setOrdenes(getOrders());

    function onUpdated() {
      setOrdenes(getOrders());
    }

    window.addEventListener('ordenesUpdated', onUpdated);
    return () => window.removeEventListener('ordenesUpdated', onUpdated);
  }, []);

  function openBoleta(o) {
    setSelected(o);
  }

  function closeBoleta() {
    setSelected(null);
  }

  function printBoleta(o) {
    if (!o) return;
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;
    const itemsHtml = o.items.map(it => {
      const precioUnit = Number(it.precio_unitario_final ?? it.precio ?? it.precio_original ?? 0);
      const precioOriginal = Number(it.precio_original ?? it.precio ?? 0);
      const descuento = Number(it.descuento_unitario || 0);
      const subtotal = Number(it.subtotal ?? precioUnit * it.cantidad);
      let line = `
      <tr>
        <td style="padding:6px;border-bottom:1px solid #eee">${it.nombre}`;
      if (descuento > 0) {
        line += `<div style="font-size:12px;color:#666;margin-top:6px">Precio: <span style=\"text-decoration:line-through;color:#a0a0a0\">$${precioOriginal.toLocaleString()}</span> → <strong>$${precioUnit.toLocaleString()}</strong> (desc. $${descuento.toLocaleString()})</div>`;
      }
      line += `</td>
        <td style="padding:6px;border-bottom:1px solid #eee;text-align:center">${it.cantidad}</td>
        <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">$${precioUnit.toLocaleString()}</td>
        <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">$${subtotal.toLocaleString()}</td>
      </tr>
    `;
      return line;
    }).join('');

    const usuario = o.usuario || {};

    const html = `
      <html>
      <head>
        <title>Boleta ${o.id}</title>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, Helvetica, sans-serif; color: #222; padding: 20px; }
          .ticket { max-width: 720px; margin: 0 auto; }
          .header { display:flex; align-items:center; gap:12px; }
          .logo { width:64px; height:64px; border-radius:6px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; font-weight:bold }
          .meta { margin-left:8px }
          table { width:100%; border-collapse:collapse; margin-top:12px }
          td, th { padding:6px }
          .right { text-align:right }
          .qr { width:120px; height:120px; border: 4px dashed #ddd; display:inline-block; text-align:center; padding-top:34px; font-size:12px; color:#666 }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="logo">Mil<br/>Sabores</div>
            <div class="meta">
              <h2 style="margin:0">Pastelería Mil Sabores</h2>
              <div style="color:#666">RUT: 12.345.678-9</div>
            </div>
          </div>

          <div style="margin-top:12px; display:flex; justify-content:space-between; align-items:center">
            <div>
              <div><strong>Boleta ID:</strong> ${o.id}</div>
              <div><strong>Fecha:</strong> ${new Date(o.fecha).toLocaleString()}</div>
              <div><strong>Usuario:</strong> ${usuario.nombre || usuario.correo || 'Invitado'}</div>
            </div>
            <div style="text-align:right">
              <div class="qr">QR<br/>${o.id.slice(-6)}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr style="background:#f8f9fa"><th style="text-align:left">Descripción</th><th style="text-align:center">Cant.</th><th style="text-align:right">P. Unit</th><th style="text-align:right">Subtotal</th></tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style="padding-top:10px;text-align:right"><strong>Total</strong></td>
                <td style="padding-top:10px;text-align:right"><strong>$${o.total.toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>

          <div style="margin-top:14px; color:#666">Gracias por su compra.</div>
        </div>
      </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
  }


  return (
    <AdminLayout title="Órdenes">
      <div style={{ background: 'white', padding: 16, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3>Órdenes ({ordenes.length})</h3>
        {ordenes.length === 0 ? (
          <p style={{ color: '#666' }}>No hay órdenes registradas.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: 12, border: '1px solid #eee' }}>ID</th>
                  <th style={{ padding: 12, border: '1px solid #eee' }}>Fecha</th>
                  <th style={{ padding: 12, border: '1px solid #eee' }}>Usuario</th>
                  <th style={{ padding: 12, border: '1px solid #eee' }}>Items</th>
                  <th style={{ padding: 12, border: '1px solid #eee' }}>Total</th>
                  <th style={{ padding: 12, border: '1px solid #eee' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map(o => (
                  <tr key={o.id}>
                    <td style={{ padding: 12, border: '1px solid #eee' }}>{o.id}</td>
                    <td style={{ padding: 12, border: '1px solid #eee' }}>{new Date(o.fecha).toLocaleString()}</td>
                    <td style={{ padding: 12, border: '1px solid #eee' }}>{o.usuario?.nombre || o.usuario?.correo || 'Invitado'}</td>
                    <td style={{ padding: 12, border: '1px solid #eee' }}>
                      {o.items.map(it => (
                        <div key={it.id} style={{ marginBottom: 6 }}>
                          {it.nombre} x{it.cantidad} — ${ ((it.subtotal != null) ? it.subtotal : ( (it.precio_unitario_final ?? it.precio ?? it.precio_original || 0) * it.cantidad )).toLocaleString() }
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: 12, border: '1px solid #eee' }}>${o.total.toLocaleString()}</td>
                    <td style={{ padding: 12, border: '1px solid #eee' }}>
                      <button onClick={() => openBoleta(o)} style={{ marginRight: 8, padding: '6px 10px', background: '#2b7cff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Ver boleta</button>
                      <button onClick={() => printBoleta(o)} style={{ padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Imprimir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal de boleta */}
        {selected && (
          <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2200 }} onClick={closeBoleta}>
            <div onClick={e => e.stopPropagation()} style={{ width: 720, maxWidth: '95%', background: '#fff', borderRadius: 8, padding: 20, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Boleta — {selected.id}</h3>
                <div>
                  <button onClick={() => printBoleta(selected)} style={{ marginRight: 8, padding: '6px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Imprimir</button>
                  <button onClick={closeBoleta} style={{ padding: '6px 10px', background: '#ddd', color: '#222', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cerrar</button>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 52, height: 52, borderRadius: 6, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>Logo</div>
                      <div>
                        <div style={{ fontWeight: 700 }}>Pastelería Mil Sabores</div>
                        <div style={{ color: '#666' }}>RUT: 12.345.678-9</div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div><strong>Fecha:</strong> {new Date(selected.fecha).toLocaleString()}</div>
                      <div><strong>Usuario:</strong> {selected.usuario?.nombre || selected.usuario?.correo || 'Invitado'}</div>
                      {selected.usuario?.telefono && <div><strong>Tel:</strong> {selected.usuario.telefono}</div>}
                      {selected.usuario?.direccion && <div><strong>Dirección:</strong> {selected.usuario.direccion}</div>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ width: 120, height: 120, border: '4px dashed #ddd', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>QR<br/>{selected.id.slice(-6)}</div>
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: 8, border: '1px solid #eee', textAlign: 'left' }}>Descripción</th>
                      <th style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}>Cant.</th>
                      <th style={{ padding: 8, border: '1px solid #eee', textAlign: 'right' }}>P. Unit</th>
                      <th style={{ padding: 8, border: '1px solid #eee', textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map(it => {
                      const precioUnit = Number(it.precio_unitario_final ?? it.precio ?? it.precio_original ?? 0);
                      const precioOriginal = Number(it.precio_original ?? it.precio ?? 0);
                      const descuento = Number(it.descuento_unitario || 0);
                      const subtotal = Number(it.subtotal ?? precioUnit * it.cantidad);
                      return (
                        <tr key={it.id}>
                          <td style={{ padding: 8, border: '1px solid #eee' }}>
                            {it.nombre}
                            {descuento > 0 && (
                              <div style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
                                <span style={{ textDecoration: 'line-through', color: '#a0a0a0' }}>${precioOriginal.toLocaleString()}</span>
                                <span style={{ marginLeft: 8 }}>${precioUnit.toLocaleString()}</span>
                                <span style={{ marginLeft: 8, color: '#d9534f' }}>(-${descuento.toLocaleString()})</span>
                              </div>
                            )}
                          </td>
                          <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'center' }}>{it.cantidad}</td>
                          <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'right' }}>${precioUnit.toLocaleString()}</td>
                          <td style={{ padding: 8, border: '1px solid #eee', textAlign: 'right' }}>${subtotal.toLocaleString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} style={{ padding: 8, textAlign: 'right', border: '1px solid #eee' }}><strong>Total</strong></td>
                      <td style={{ padding: 8, textAlign: 'right', border: '1px solid #eee' }}><strong>${selected.total.toLocaleString()}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
