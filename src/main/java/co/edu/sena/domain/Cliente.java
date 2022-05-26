package co.edu.sena.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Cliente.
 */
@Entity
@Table(name = "cliente")
public class Cliente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 25)
    @Column(name = "nombre_cliente", length = 25, nullable = false, unique = true)
    private String nombreCliente;

    @NotNull
    @Size(max = 25)
    @Column(name = "apellidocliente", length = 25, nullable = false, unique = true)
    private String apellidocliente;

    @NotNull
    @Size(max = 25)
    @Column(name = "bloque_cliente", length = 25, nullable = false, unique = true)
    private String bloqueCliente;

    @NotNull
    @Size(max = 25)
    @Column(name = "phone", length = 25, nullable = false, unique = true)
    private String phone;

    @NotNull
    @Size(max = 25)
    @Column(name = "correo_cliente", length = 25, nullable = false, unique = true)
    private String correoCliente;

    @OneToMany(mappedBy = "cliente")
    @JsonIgnoreProperties(value = { "user", "cliente", "visitante", "registro" }, allowSetters = true)
    private Set<Empleado> empleados = new HashSet<>();

    @OneToMany(mappedBy = "cliente")
    @JsonIgnoreProperties(value = { "facturacion", "cliente" }, allowSetters = true)
    private Set<TarifaPlana> tarifaPlanas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Cliente id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreCliente() {
        return this.nombreCliente;
    }

    public Cliente nombreCliente(String nombreCliente) {
        this.setNombreCliente(nombreCliente);
        return this;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getApellidocliente() {
        return this.apellidocliente;
    }

    public Cliente apellidocliente(String apellidocliente) {
        this.setApellidocliente(apellidocliente);
        return this;
    }

    public void setApellidocliente(String apellidocliente) {
        this.apellidocliente = apellidocliente;
    }

    public String getBloqueCliente() {
        return this.bloqueCliente;
    }

    public Cliente bloqueCliente(String bloqueCliente) {
        this.setBloqueCliente(bloqueCliente);
        return this;
    }

    public void setBloqueCliente(String bloqueCliente) {
        this.bloqueCliente = bloqueCliente;
    }

    public String getPhone() {
        return this.phone;
    }

    public Cliente phone(String phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCorreoCliente() {
        return this.correoCliente;
    }

    public Cliente correoCliente(String correoCliente) {
        this.setCorreoCliente(correoCliente);
        return this;
    }

    public void setCorreoCliente(String correoCliente) {
        this.correoCliente = correoCliente;
    }

    public Set<Empleado> getEmpleados() {
        return this.empleados;
    }

    public void setEmpleados(Set<Empleado> empleados) {
        if (this.empleados != null) {
            this.empleados.forEach(i -> i.setCliente(null));
        }
        if (empleados != null) {
            empleados.forEach(i -> i.setCliente(this));
        }
        this.empleados = empleados;
    }

    public Cliente empleados(Set<Empleado> empleados) {
        this.setEmpleados(empleados);
        return this;
    }

    public Cliente addEmpleado(Empleado empleado) {
        this.empleados.add(empleado);
        empleado.setCliente(this);
        return this;
    }

    public Cliente removeEmpleado(Empleado empleado) {
        this.empleados.remove(empleado);
        empleado.setCliente(null);
        return this;
    }

    public Set<TarifaPlana> getTarifaPlanas() {
        return this.tarifaPlanas;
    }

    public void setTarifaPlanas(Set<TarifaPlana> tarifaPlanas) {
        if (this.tarifaPlanas != null) {
            this.tarifaPlanas.forEach(i -> i.setCliente(null));
        }
        if (tarifaPlanas != null) {
            tarifaPlanas.forEach(i -> i.setCliente(this));
        }
        this.tarifaPlanas = tarifaPlanas;
    }

    public Cliente tarifaPlanas(Set<TarifaPlana> tarifaPlanas) {
        this.setTarifaPlanas(tarifaPlanas);
        return this;
    }

    public Cliente addTarifaPlana(TarifaPlana tarifaPlana) {
        this.tarifaPlanas.add(tarifaPlana);
        tarifaPlana.setCliente(this);
        return this;
    }

    public Cliente removeTarifaPlana(TarifaPlana tarifaPlana) {
        this.tarifaPlanas.remove(tarifaPlana);
        tarifaPlana.setCliente(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Cliente)) {
            return false;
        }
        return id != null && id.equals(((Cliente) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Cliente{" +
            "id=" + getId() +
            ", nombreCliente='" + getNombreCliente() + "'" +
            ", apellidocliente='" + getApellidocliente() + "'" +
            ", bloqueCliente='" + getBloqueCliente() + "'" +
            ", phone='" + getPhone() + "'" +
            ", correoCliente='" + getCorreoCliente() + "'" +
            "}";
    }
}
