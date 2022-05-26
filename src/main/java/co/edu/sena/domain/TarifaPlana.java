package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A TarifaPlana.
 */
@Entity
@Table(name = "tarifa_plana")
public class TarifaPlana implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "valor", nullable = false, unique = true)
    private Float valor;

    @NotNull
    @Size(max = 20)
    @Column(name = "fecha_pago", length = 20, nullable = false, unique = true)
    private String fechaPago;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "tipoVehiculos", "tarifaPlanas", "formaDepago" }, allowSetters = true)
    private Facturacion facturacion;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "empleados", "tarifaPlanas" }, allowSetters = true)
    private Cliente cliente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TarifaPlana id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getValor() {
        return this.valor;
    }

    public TarifaPlana valor(Float valor) {
        this.setValor(valor);
        return this;
    }

    public void setValor(Float valor) {
        this.valor = valor;
    }

    public String getFechaPago() {
        return this.fechaPago;
    }

    public TarifaPlana fechaPago(String fechaPago) {
        this.setFechaPago(fechaPago);
        return this;
    }

    public void setFechaPago(String fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Facturacion getFacturacion() {
        return this.facturacion;
    }

    public void setFacturacion(Facturacion facturacion) {
        this.facturacion = facturacion;
    }

    public TarifaPlana facturacion(Facturacion facturacion) {
        this.setFacturacion(facturacion);
        return this;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public TarifaPlana cliente(Cliente cliente) {
        this.setCliente(cliente);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TarifaPlana)) {
            return false;
        }
        return id != null && id.equals(((TarifaPlana) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TarifaPlana{" +
            "id=" + getId() +
            ", valor=" + getValor() +
            ", fechaPago='" + getFechaPago() + "'" +
            "}";
    }
}
