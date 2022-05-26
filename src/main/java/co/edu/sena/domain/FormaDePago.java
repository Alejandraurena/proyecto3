package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A FormaDePago.
 */
@Entity
@Table(name = "forma_de_pago")
public class FormaDePago implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "forma_pago", length = 20, nullable = false, unique = true)
    private String formaPago;

    @OneToMany(mappedBy = "formaDepago")
    @JsonIgnoreProperties(value = { "tipoVehiculos", "tarifaPlanas", "formaDepago" }, allowSetters = true)
    private Set<Facturacion> facturacions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FormaDePago id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFormaPago() {
        return this.formaPago;
    }

    public FormaDePago formaPago(String formaPago) {
        this.setFormaPago(formaPago);
        return this;
    }

    public void setFormaPago(String formaPago) {
        this.formaPago = formaPago;
    }

    public Set<Facturacion> getFacturacions() {
        return this.facturacions;
    }

    public void setFacturacions(Set<Facturacion> facturacions) {
        if (this.facturacions != null) {
            this.facturacions.forEach(i -> i.setFormaDepago(null));
        }
        if (facturacions != null) {
            facturacions.forEach(i -> i.setFormaDepago(this));
        }
        this.facturacions = facturacions;
    }

    public FormaDePago facturacions(Set<Facturacion> facturacions) {
        this.setFacturacions(facturacions);
        return this;
    }

    public FormaDePago addFacturacion(Facturacion facturacion) {
        this.facturacions.add(facturacion);
        facturacion.setFormaDepago(this);
        return this;
    }

    public FormaDePago removeFacturacion(Facturacion facturacion) {
        this.facturacions.remove(facturacion);
        facturacion.setFormaDepago(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormaDePago)) {
            return false;
        }
        return id != null && id.equals(((FormaDePago) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormaDePago{" +
            "id=" + getId() +
            ", formaPago='" + getFormaPago() + "'" +
            "}";
    }
}
