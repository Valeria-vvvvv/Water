import React from "react";
import { Link } from "react-router-dom";
import "./PricingSection.css";
import { pricing } from "../../../data";

const PricingSection = () => {
  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        <h2 className="projects-title">
          НАШИ
          <br />
          <span className="projects-subtitle"> РАСЦЕНКИ</span>
        </h2>

        <div className="pricing-table">
          <table>
            <thead>
              <tr>
                <th>НАИМЕНОВАНИЕ РАБОТ</th>
                <th>ЕД. ИЗМ.</th>
                <th>СТОИМОСТЬ, РУБ. (ОТ)</th>
              </tr>
            </thead>
            <tbody>
              {pricing.map((item, index) => (
                <tr key={index}>
                  <td>{item.service}</td>
                  <td>{item.unit}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pricing-button-container">
          <Link to="/prices" className="pricing-all-prices-btn">
            Все цены
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
