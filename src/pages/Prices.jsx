import { useState, useEffect } from "react";
import Footer from "../components/ui/Footer/Footer";
import { pricingTables } from "../data/pricingTables";
import "./Prices.css";

export const Prices = () => {
  const [openId, setOpenId] = useState("general");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="prices-page">
      <div className="prices-container">
        <div className="prices-header">
          <h1 className="prices-title">
            ПРАЙС
            <span className="prices-subtitle"> ЛИСТ</span>
          </h1>
          <p className="prices-description">
            Актуальные расценки на все виды ремонтных и строительных работ в
            Донецке
          </p>
        </div>

        <div className="prices-accordion">
          {pricingTables.map((table) => (
            <div key={table.id} className="prices-accordion-item">
              <button
                className={`prices-accordion-header${openId === table.id ? " open" : ""}`}
                onClick={() => setOpenId(openId === table.id ? null : table.id)}
              >
                <span>{table.title}</span>
                <span className="prices-accordion-icon">
                  {openId === table.id ? "−" : "+"}
                </span>
              </button>

              {openId === table.id && (
                <div className="prices-table-wrap">
                  <table className="prices-table">
                    <thead>
                      <tr>
                        <th>№</th>
                        <th>Наименование услуги</th>
                        <th>Ед. изм.</th>
                        <th>Цена, руб.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{row.name}</td>
                          <td>{row.unit}</td>
                          <td>{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
