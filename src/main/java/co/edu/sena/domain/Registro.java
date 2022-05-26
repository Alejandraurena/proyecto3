package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Registro.
 */
@Entity
@Table(name = "registro")
public class Registro implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "hora_ingreso", nullable = false, unique = true)
    private ZonedDateTime horaIngreso;

    @NotNull
    @Column(name = "hora_salida", nullable = false, unique = true)
    private ZonedDateTime horaSalida;

    @OneToMany(mappedBy = "registro")
    @JsonIgnoreProperties(value = { "user", "cliente", "visitante", "registro" }, allowSetters = true)
    private Set<Empleado> empleados = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "registros", "tipoVehiculo" }, allowSetters = true)
    private Vehiculo vehiculo;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Registro id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getHoraIngreso() {
        return this.horaIngreso;
    }

    public Registro horaIngreso(ZonedDateTime horaIngreso) {
        this.setHoraIngreso(horaIngreso);
        return this;
    }

    public void setHoraIngreso(ZonedDateTime horaIngreso) {
        this.horaIngreso = horaIngreso;
    }

    public ZonedDateTime getHoraSalida() {
        return this.horaSalida;
    }

    public Registro horaSalida(ZonedDateTime horaSalida) {
        this.setHoraSalida(horaSalida);
        return this;
    }

    public void setHoraSalida(ZonedDateTime horaSalida) {
        this.horaSalida = horaSalida;
    }

    public Set<Empleado> getEmpleados() {
        return this.empleados;
    }

    public void setEmpleados(Set<Empleado> empleados) {
        if (this.empleados != null) {
            this.empleados.forEach(i -> i.setRegistro(null));
        }
        if (empleados != null) {
            empleados.forEach(i -> i.setRegistro(this));
        }
        this.empleados = empleados;
    }

    public Registro empleados(Set<Empleado> empleados) {
        this.setEmpleados(empleados);
        return this;
    }

    public Registro addEmpleado(Empleado empleado) {
        this.empleados.add(empleado);
        empleado.setRegistro(this);
        return this;
    }

    public Registro removeEmpleado(Empleado empleado) {
        this.empleados.remove(empleado);
        empleado.setRegistro(null);
        return this;
    }

    public Vehiculo getVehiculo() {
        return this.vehiculo;
    }

    public void setVehiculo(Vehiculo vehiculo) {
        this.vehiculo = vehiculo;
    }

    public Registro vehiculo(Vehiculo vehiculo) {
        this.setVehiculo(vehiculo);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Registro)) {
            return false;
        }
        return id != null && id.equals(((Registro) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Registro{" +
            "id=" + getId() +
            ", horaIngreso='" + getHoraIngreso() + "'" +
            ", horaSalida='" + getHoraSalida() + "'" +
            "}";
    }
}
