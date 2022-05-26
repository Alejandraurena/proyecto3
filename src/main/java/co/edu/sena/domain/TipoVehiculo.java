package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A TipoVehiculo.
 */
@Entity
@Table(name = "tipo_vehiculo")
public class TipoVehiculo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 25)
    @Column(name = "tipo_vehiculo", length = 25, nullable = false, unique = true)
    private String tipoVehiculo;

    @NotNull
    @Size(max = 25)
    @Column(name = "marca_vehiculo", length = 25, nullable = false, unique = true)
    private String marcaVehiculo;

    @OneToMany(mappedBy = "tipoVehiculo")
    @JsonIgnoreProperties(value = { "registros", "tipoVehiculo" }, allowSetters = true)
    private Set<Vehiculo> vehiculos = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "tipoVehiculos", "tarifaPlanas", "formaDepago" }, allowSetters = true)
    private Facturacion facturacion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TipoVehiculo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoVehiculo() {
        return this.tipoVehiculo;
    }

    public TipoVehiculo tipoVehiculo(String tipoVehiculo) {
        this.setTipoVehiculo(tipoVehiculo);
        return this;
    }

    public void setTipoVehiculo(String tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public String getMarcaVehiculo() {
        return this.marcaVehiculo;
    }

    public TipoVehiculo marcaVehiculo(String marcaVehiculo) {
        this.setMarcaVehiculo(marcaVehiculo);
        return this;
    }

    public void setMarcaVehiculo(String marcaVehiculo) {
        this.marcaVehiculo = marcaVehiculo;
    }

    public Set<Vehiculo> getVehiculos() {
        return this.vehiculos;
    }

    public void setVehiculos(Set<Vehiculo> vehiculos) {
        if (this.vehiculos != null) {
            this.vehiculos.forEach(i -> i.setTipoVehiculo(null));
        }
        if (vehiculos != null) {
            vehiculos.forEach(i -> i.setTipoVehiculo(this));
        }
        this.vehiculos = vehiculos;
    }

    public TipoVehiculo vehiculos(Set<Vehiculo> vehiculos) {
        this.setVehiculos(vehiculos);
        return this;
    }

    public TipoVehiculo addVehiculo(Vehiculo vehiculo) {
        this.vehiculos.add(vehiculo);
        vehiculo.setTipoVehiculo(this);
        return this;
    }

    public TipoVehiculo removeVehiculo(Vehiculo vehiculo) {
        this.vehiculos.remove(vehiculo);
        vehiculo.setTipoVehiculo(null);
        return this;
    }

    public Facturacion getFacturacion() {
        return this.facturacion;
    }

    public void setFacturacion(Facturacion facturacion) {
        this.facturacion = facturacion;
    }

    public TipoVehiculo facturacion(Facturacion facturacion) {
        this.setFacturacion(facturacion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TipoVehiculo)) {
            return false;
        }
        return id != null && id.equals(((TipoVehiculo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TipoVehiculo{" +
            "id=" + getId() +
            ", tipoVehiculo='" + getTipoVehiculo() + "'" +
            ", marcaVehiculo='" + getMarcaVehiculo() + "'" +
            "}";
    }
}
