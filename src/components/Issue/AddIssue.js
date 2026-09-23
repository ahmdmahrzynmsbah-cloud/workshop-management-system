import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createIssue } from "../../actions/issueActions";
import classnames from "classnames";
import { t, subscribeLanguage } from "../../i18n/translations";

class AddIssue extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      type: "",
      description: "",
      carModel: "",
      localization: "",
      errors: {},
      creationDate: "",
      dateFrom: "",
      dateTo: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = subscribeLanguage(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const newIssue = {
      title: this.state.title,
      type: this.state.type,
      description: this.state.description,
      carModel: this.state.carModel,
      localization: this.state.localization,
      creationDate: this.state.creationDate,
      dateFrom: this.state.dateFrom,
      dateTo: this.state.dateTo
    };
    this.props.createIssue(newIssue, this.props.history);
  }

  render() {
    const { errors } = this.state;

    return (
      <div>
        <div className="project">
          <div className="container">
            <div className="row">
              <div className="col-md-8 m-auto">
                <h2 className="display-4 text-center font-weight-bold">{t("createIssue")}</h2>
                <hr />
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <label className="font-weight-bold">عنوان الطلب / المشكلة</label>
                    <input
                      type="text"
                      className={classnames("form-control form-control-lg ", {
                        "is-invalid": errors.title
                      })}
                      placeholder="مثال: عطل في ناقل الحركة / فحص دوري للمحرك"
                      name="title"
                      value={this.state.title}
                      onChange={this.onChange}
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">{t("issueType")}</label>
                    <select
                      className="form-control form-control-lg"
                      name="type"
                      value={this.state.type}
                      onChange={this.onChange}
                    >
                      <option value="">-- اختر نوع العطل --</option>
                      <option value="DIAGNOSTICS">{t("catDiagnostics")}</option>
                      <option value="ENGINE">{t("catEngine")}</option>
                      <option value="TRANSMISSION">{t("catTransmission")}</option>
                      <option value="SUSPENSION">{t("catSuspension")}</option>
                      <option value="ELECTRONICS">{t("catElectronics")}</option>
                      <option value="OTHER">{t("catOther")}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">{t("carModel")}</label>
                    <input
                      type="text"
                      className={classnames("form-control form-control-lg ", {
                        "is-invalid": errors.carModel
                      })}
                      placeholder="مثال: Toyota Corolla 2021"
                      name="carModel"
                      value={this.state.carModel}
                      onChange={this.onChange}
                    />
                    {errors.carModel && (
                      <div className="invalid-feedback">{errors.carModel}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">{t("localization")}</label>
                    <input
                      type="text"
                      className={classnames("form-control form-control-lg ", {
                        "is-invalid": errors.localization
                      })}
                      placeholder="مثال: الرياض / القاهرة / جدة"
                      name="localization"
                      value={this.state.localization}
                      onChange={this.onChange}
                    />
                    {errors.localization && (
                      <div className="invalid-feedback">
                        {errors.localization}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="font-weight-bold">{t("description")}</label>
                    <textarea
                      rows="4"
                      className={classnames("form-control form-control-lg ", {
                        "is-invalid": errors.description
                      })}
                      placeholder="صف العطل والملاحظات التي تواجهها بالتفصيل..."
                      name="description"
                      value={this.state.description}
                      onChange={this.onChange}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">
                        {errors.description}
                      </div>
                    )}{" "}
                  </div>
                  <label className="font-weight-bold d-block text-muted">
                    الفترة الزمنية المناسبة لفحص السيارة
                  </label>
                  <div className="row">
                    <div className="col-md-6 form-group">
                      <label className="small text-muted">{t("startDate")}</label>
                      <input
                        type="date"
                        className={classnames("form-control form-control-lg ", {
                          "is-invalid": errors.dateFrom
                        })}
                        name="dateFrom"
                        value={this.state.dateFrom}
                        onChange={this.onChange}
                      />
                      {errors.dateFrom && (
                        <div className="invalid-feedback">{errors.dateFrom}</div>
                      )}
                    </div>
                    <div className="col-md-6 form-group">
                      <label className="small text-muted">{t("endDate")}</label>
                      <input
                        type="date"
                        className={classnames("form-control form-control-lg ", {
                          "is-invalid": errors.dateTo
                        })}
                        name="dateTo"
                        value={this.state.dateTo}
                        onChange={this.onChange}
                      />
                      {errors.dateTo && (
                        <div className="invalid-feedback">{errors.dateTo}</div>
                      )}
                    </div>
                  </div>
                  <input
                    type="submit"
                    value={t("save")}
                    className="btn btn-danger btn-block mt-4 btn-lg font-weight-bold"
                    style={{ backgroundColor: "#e74c3c" }}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddIssue.propTypes = {
  createIssue: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createIssue }
)(AddIssue);
