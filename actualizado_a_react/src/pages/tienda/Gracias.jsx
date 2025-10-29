import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import PageHeaderCard from '../../components/cards/PageHeaderCard';
import { useLocation, Link } from 'react-router-dom';
import { getOrders } from '../../utils/orders';
import { showToast } from '../../utils/toast';

async function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

async function downloadBoletaByOrder(o) {
  if (!o) return;
  try {
    await loadScript('https://unpkg.com/html2canvas@1.4.1/dist/html2canvas.min.js');
    await loadScript('https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js');

    const wrapper = document.createElement('div');
    wrapper.style.position = 'fixed';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '0';
    wrapper.style.width = '800px';
    const itemsHtml = o.items.map(it => {
      const precioUnit = Number(it.precio_unitario_final ?? it.precio ?? it.precio_original ?? 0);
      const precioOriginal = Number(it.precio_original ?? it.precio ?? 0);
      const descuento = Number(it.descuento_unitario || 0);
      const subtotal = Number(it.subtotal ?? precioUnit * it.cantidad);
      let row = `
      <tr>
        <td style="padding:6px;border-bottom:1px solid #eee">${it.nombre}`;
      if (descuento > 0) {
        row += `<div style="font-size:12px;color:#666;margin-top:6px">Precio: <span style=\"text-decoration:line-through;color:#a0a0a0\">$${precioOriginal.toLocaleString()}</span> → <strong>$${precioUnit.toLocaleString()}</strong> (desc. $${descuento.toLocaleString()})</div>`;
      }
      row += `</td>
        <td style="padding:6px;border-bottom:1px solid #eee;text-align:center">${it.cantidad}</td>
        <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">$${precioUnit.toLocaleString()}</td>
        <td style="padding:6px;border-bottom:1px solid #eee;text-align:right">$${subtotal.toLocaleString()}</td>
      </tr>
    `;
      return row;
    }).join('');

    const usuario = o.usuario || {};
    wrapper.innerHTML = `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#222; padding:20px; background:#fff; width:760px">
        <div style="display:flex; gap:12px; align-items:center">
          <div style="width:64px;height:64px;border-radius:6px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-weight:bold">Mil<br/>Sabores</div>
          <div>
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
            <div style="width:120px;height:120px;border:4px dashed #ddd;display:inline-flex;align-items:center;justify-content:center;color:#666">QR<br/>${o.id.slice(-6)}</div>
          </div>
        </div>
        <table style="width:100%; border-collapse:collapse; margin-top:12px">
          <thead>
            <tr style="background:#f8f9fa"><th style="text-align:left">Descripción</th><th style="text-align:center">Cant.</th><th style="text-align:right">P. Unit</th><th style="text-align:right">Subtotal</th></tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding-top:10px;text-align:right"><strong>Total</strong></td>
              <td style="padding-top:10px;text-align:right"><strong>$${o.total.toLocaleString()}</strong></td>
            </tr>
          </tfoot>
        </table>
        <div style="margin-top:14px; color:#666">Gracias por su compra.</div>
      </div>
    `;

    document.body.appendChild(wrapper);
    const canvas = await window.html2canvas(wrapper, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height / canvas.width) * imgWidth;
    pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight);
    pdf.save(`boleta_${o.id}.pdf`);
    setTimeout(() => { try { wrapper.remove(); } catch(_){} }, 500);
  } catch (err) {
    console.error('Error generando PDF:', err);
    showToast('error', 'No se pudo generar el PDF. Intenta imprimir en su lugar.');
  }
}

export default function Gracias() {
  const { state } = useLocation();
  const ordenId = state?.ordenId || null;

  const handleDownload = async () => {
    if (!ordenId) return showToast('warn', 'No hay ID de orden disponible para descargar.');
    const ordenes = getOrders();
    const orden = ordenes.find(o => o.id === ordenId);
    if (!orden) return showToast('error', 'No se encontró la orden. Intenta nuevamente.');
    await downloadBoletaByOrder(orden);
  };

  return (
    <div>
      <Header />
      <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <PageHeaderCard title="¡Gracias por tu compra!" subtitle="Tu pedido se ha registrado correctamente" />

        <div style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.06)', marginTop: 18 }}>
          <h2 style={{ color: '#8b4513' }}>¡Muchas gracias por elegir Pastelería Mil Sabores!</h2>
          <p style={{ color: '#444', lineHeight: 1.6 }}>
            Hemos recibido tu pedido y ya estamos trabajando en él. En breve recibirás un correo con los detalles de la compra.
          </p>

          {ordenId && (
            <div style={{ marginTop: 12, padding: 12, background: '#f8f9fa', borderRadius: 6 }}>
              <strong>ID de la orden:</strong> {ordenId}
            </div>
          )}

          <p style={{ marginTop: 16, color: '#666' }}>Si tienes dudas o necesitas modificar tu pedido, contáctanos por WhatsApp o correo.</p>

          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button onClick={handleDownload} style={{ padding: '10px 16px', background: '#6f42c1', color: 'white', borderRadius: 6, border: 'none', cursor: 'pointer' }}>Descargar boleta (PDF)</button>
            <Link to="/productos" style={{ padding: '10px 16px', background: '#8b4513', color: 'white', borderRadius: 6, textDecoration: 'none' }}>Seguir comprando</Link>
            <Link to="/" style={{ padding: '10px 16px', background: '#f1f1f1', color: '#333', borderRadius: 6, textDecoration: 'none' }}>Volver al inicio</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
