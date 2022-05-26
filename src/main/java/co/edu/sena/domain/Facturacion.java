package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Facturacion.
 */
@Entity
@Table(name = "facturacion")
public class Facturacion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "fecha_factura", nullable = false, unique = true)
    private LocalDate fechaFactura;

    @NotNull
    @Column(name = "valor_factura", nullable = false, unique = true)
    private Float valorFactura;

    @OneToMany(mappedBy = "facturacion")
    @JsonIgnoreProperties(value = { "vehiculos", "facturacion" }, allowSetters = true)
    private Set<TipoVehiculo> tipoVehiculos = new HashSet<>();

    @OneToMany(mappedBy = "facturacion")
    @JsonIgnoreProperties(value = { "facturacion", "cliente" }, allowSetters = true)
    private Set<TarifaPlana> tarifaPlanas = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "facturacions" }, allowSetters = true)
    private FormaDePago formaDepago;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facturacion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFechaFactura() {
        return this.fechaFactura;
    }

    public Facturacion fechaFactura(LocalDate fechaFactura) {
        this.setFechaFactura(fechaFactura);
        return this;
    }

    public void setFechaFactura(LocalDate fechaFactura) {
        this.fechaFactura = fechaFactura;
    }

    public Float getValorFactura() {
        return this.valorFactura;
    }

    public Facturacion valorFactura(Float valorFactura) {
        this.setValorFactura(valorFactura);
        return this;
    }

    public void setValorFactura(Float valorFactura) {
        this.valorFactura = valorFactura;
    }

    public Set<TipoVehiculo> getTipoVehiculos() {
        return this.tipoVehiculos;
    }

    public void setTipoVehiculos(Set<TipoVehiculo> tipoVehiculos) {
        if (this.tipoVehiculos != null) {
            this.tipoVehiculos.forEach(i -> i.setFacturacion(null));
        }
        if (tipoVehiculos != null) {
            tipoVehiculos.forEach(i -> i.setFacturacion(this));
        }
        this.tipoVehiculos = tipoVehiculos;
    }

    public Facturacion tipoVehiculos(Set<TipoVehiculo> tipoVehiculos) {
        this.setTipoVehiculos(tipoVehiculos);
        return this;
    }

    public Facturacion addTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculos.add(tipoVehiculo);
        tipoVehiculo.setFacturacion(this);
        return this;
    }

    public Facturacion removeTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculos.remove(tipoVehiculo);
        tipoVehiculo.setFacturacion(null);
        return this;
    }

    public Set<TarifaPlana> getTarifaPlanas() {
        return this.tarifaPlanas;
    }

    public void setTarifaPlanas(Set<TarifaPlana> tarifaPlanas) {
        if (this.tarifaPlanas != null) {
            this.tarifaPlanas.forEach(i -> i.setFacturacion(null));
        }
        if (tarifaPlanas != null) {
            tarifaPlanas.forEach(i -> i.setFacturacion(this));
        }
        this.tarifaPlanas = tarifaPlanas;
    }

    public Facturacion tarifaPlanas(Set<TarifaPlana> tarifaPlanas) {
        this.setTarifaPlanas(tarifaPlanas);
        return this;
    }

    public Facturacion addTarifaPlana(TarifaPlana tarifaPlana) {
        this.tarifaPlanas.add(tarifaPlana);
        tarifaPlana.setFacturacion(this);
        return this;
    }

    public Facturacion removeTarifaPlana(TarifaPlana tarifaPlana) {
        this.tarifaPlanas.remove(tarifaPlana);
        tarifaPlana.setFacturacion(null);
        return this;
    }

    public FormaDePago getFormaDepago() {
        return this.formaDepago;
    }

    public void setFormaDepago(FormaDePago formaDePago) {
        this.formaDepago = formaDePago;
    }

    public Facturacion formaDepago(FormaDePago formaDePago) {
        this.setFormaDepago(formaDePago);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facturacion)) {
            return false;
        }
        return id != null && id.equals(((Facturacion) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facturacion{" +
            "id=" + getId() +
            ", fechaFactura='" + getFechaFactura() + "'" +
            ", valorFactura=" + getValorFactura() +
            "}";
    }
}
