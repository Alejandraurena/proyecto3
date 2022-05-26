package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Vehiculo.
 */
@Entity
@Table(name = "vehiculo")
public class Vehiculo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "placa", length = 20, nullable = false, unique = true)
    private String placa;

    @OneToMany(mappedBy = "vehiculo")
    @JsonIgnoreProperties(value = { "empleados", "vehiculo" }, allowSetters = true)
    private Set<Registro> registros = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "vehiculos", "facturacion" }, allowSetters = true)
    private TipoVehiculo tipoVehiculo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Vehiculo id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return this.placa;
    }

    public Vehiculo placa(String placa) {
        this.setPlaca(placa);
        return this;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Set<Registro> getRegistros() {
        return this.registros;
    }

    public void setRegistros(Set<Registro> registros) {
        if (this.registros != null) {
            this.registros.forEach(i -> i.setVehiculo(null));
        }
        if (registros != null) {
            registros.forEach(i -> i.setVehiculo(this));
        }
        this.registros = registros;
    }

    public Vehiculo registros(Set<Registro> registros) {
        this.setRegistros(registros);
        return this;
    }

    public Vehiculo addRegistro(Registro registro) {
        this.registros.add(registro);
        registro.setVehiculo(this);
        return this;
    }

    public Vehiculo removeRegistro(Registro registro) {
        this.registros.remove(registro);
        registro.setVehiculo(null);
        return this;
    }

    public TipoVehiculo getTipoVehiculo() {
        return this.tipoVehiculo;
    }

    public void setTipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.tipoVehiculo = tipoVehiculo;
    }

    public Vehiculo tipoVehiculo(TipoVehiculo tipoVehiculo) {
        this.setTipoVehiculo(tipoVehiculo);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vehiculo)) {
            return false;
        }
        return id != null && id.equals(((Vehiculo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vehiculo{" +
            "id=" + getId() +
            ", placa='" + getPlaca() + "'" +
            "}";
    }
}
