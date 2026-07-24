/* Shared icon + gradient library used by both the public site and the admin
   panel, so a service's icon/gradient chosen in the panel renders identically
   on the live site. Icons are 24x24 stroke SVGs (no fill). */
(function (g) {
  g.KM_ICONS = {
    branding: '<circle cx="12" cy="12" r="9"/><path d="M8 12a4 4 0 0 1 8 0M12 3v3M12 18v3"/>',
    social: '<path d="M4 4h16v12H5.2L4 19V4z"/><path d="M8 9h8M8 12h5"/>',
    web: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18M7 14h4"/>',
    seo: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-3.8-3.8"/><path d="M8.5 12l2-2 2 1.6"/>',
    content: '<path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z"/><path d="M13.5 6.5l3 3"/>',
    campaign: '<path d="M3 10v4h4l7 4V6L7 10H3z"/><path d="M17 9a3 3 0 0 1 0 6"/>',
    analytics: '<path d="M5 20V12M10 20V6M15 20v-9M3 20h18"/>',
    video: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M10 9.5l5 2.5-5 2.5v-5z"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    ecommerce: '<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 12h11l2-8H6"/>',
    strategy: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
    camera: '<rect x="3" y="7" width="18" height="12" rx="2"/><circle cx="12" cy="13" r="3"/><path d="M9 7l1.5-2h3L15 7"/>'
  };

  g.KM_ICON_ORDER = ['branding', 'social', 'web', 'seo', 'content', 'campaign', 'analytics', 'video', 'email', 'ecommerce', 'strategy', 'camera'];

  g.KM_ICON_LABELS = {
    branding: 'Branding', social: 'Redes', web: 'Web', seo: 'SEO',
    content: 'Contenido', campaign: 'Campaña', analytics: 'Analítica',
    video: 'Video', email: 'Email', ecommerce: 'E-commerce',
    strategy: 'Estrategia', camera: 'Foto'
  };

  g.KM_GRADIENTS = [
    'linear-gradient(135deg,#1E3A8A,#6366F1)',
    'linear-gradient(135deg,#6366F1,#FF6B6B)',
    'linear-gradient(135deg,#0F172A,#1E3A8A)',
    'linear-gradient(135deg,#FF6B6B,#1E3A8A)',
    'linear-gradient(135deg,#6366F1,#4F46E5)',
    'linear-gradient(135deg,#1E3A8A,#152C6B)'
  ];

  g.KM_ICON_SVG = function (key, opts) {
    opts = opts || {};
    var size = opts.size || 30;
    var stroke = opts.stroke || '#fff';
    var paths = g.KM_ICONS[key] || g.KM_ICONS.branding;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="' + stroke +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  };
})(window);
