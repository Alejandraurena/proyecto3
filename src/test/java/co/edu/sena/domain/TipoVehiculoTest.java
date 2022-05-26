package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TipoVehiculoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TipoVehiculo.class);
        TipoVehiculo tipoVehiculo1 = new TipoVehiculo();
        tipoVehiculo1.setId(1L);
        TipoVehiculo tipoVehiculo2 = new TipoVehiculo();
        tipoVehiculo2.setId(tipoVehiculo1.getId());
        assertThat(tipoVehiculo1).isEqualTo(tipoVehiculo2);
        tipoVehiculo2.setId(2L);
        assertThat(tipoVehiculo1).isNotEqualTo(tipoVehiculo2);
        tipoVehiculo1.setId(null);
        assertThat(tipoVehiculo1).isNotEqualTo(tipoVehiculo2);
    }
}
