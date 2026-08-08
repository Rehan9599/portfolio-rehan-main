import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, GraduationCap, ChevronLeft, ChevronRight } from 'lucide-react';

const CERT_CATEGORIES = [
  { key: 'all', label: 'all' },
  { key: 'webDev', label: 'web development' },
  { key: 'softwareDev', label: 'software development' },
  { key: 'python', label: 'python' },
  { key: 'aiMl', label: 'ai & ml' },
];

const PAGE_SIZE = 4;

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

export default function CertificatesSection({ certificates }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => (activeCategory === 'all' ? certificates : certificates.filter((cert) => cert.category === activeCategory)),
    [certificates, activeCategory]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Reset to page 1 whenever the category filter changes, so you never land on an empty page
  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p) => setPage(Math.max(1, Math.min(totalPages, p)));

  return (
    <section className="certificates-section" id="certificates">
      <div className="app-container certificates-layout">

        <div className="cert-sidebar">
          <h2 className="section-heading">
            Certifications
          </h2>
          {CERT_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`cert-sidebar-btn ${activeCategory === cat.key ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span className="cert-sidebar-dot" />
              {cat.label}
            </button>
          ))}
        </div>

        <div className="cert-main-col">
          <motion.div
            className="certs-grid-v2"
            key={`${activeCategory}-${page}`} /* remount on filter/page change so entries re-stagger in */
            variants={gridVariants}
            initial="hidden"
            animate="visible"
          >
            {paginated.map((cert) => (
              <motion.div key={cert.title} className="cert-card-v2" variants={cardVariants} whileHover={{ y: -4 }}>
                <div className="cert-card-v2-image-wrap">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={`${cert.title} certificate`}
                      className="cert-card-v2-image"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  ) : (
                    <Award size={28} className="cert-card-v2-image-placeholder" />
                  )}
                  {cert.category && (
                    <span className="cert-badge-pill">
                      {CERT_CATEGORIES.find((c) => c.key === cert.category)?.label || cert.category}
                    </span>
                  )}
                </div>

                <div className="cert-card-v2-body">
                  <h3 className="cert-card-v2-title">{cert.title}</h3>
                  <p className="cert-card-v2-issuer">{cert.issuer} • {cert.year}</p>
                  {cert.description && (
                    <p className="cert-card-v2-description">{cert.description}</p>
                  )}

                  <div className="cert-card-v2-footer">
                    {cert.link ? (
                      <button
                        className="cert-link-btn"
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(cert.link, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        <GraduationCap size={15} /> Certified
                        <ExternalLink size={13} style={{ marginLeft: 'var(--space-1)' }} />
                      </button>
                    ) : (
                      <span><GraduationCap size={15} /> Certified</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {totalPages > 1 && (
            <div className="cert-pagination">
              <button
                className="cert-page-arrow"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`cert-page-number ${page === p ? 'is-active' : ''}`}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="cert-page-arrow"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}