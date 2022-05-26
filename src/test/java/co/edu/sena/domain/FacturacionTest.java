package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FacturacionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Facturacion.class);
        Facturacion facturacion1 = new Facturacion();
        facturacion1.setId(1L);
        Facturacion facturacion2 = new Facturacion();
        facturacion2.setId(facturacion1.getId());
        assertThat(facturacion1).isEqualTo(facturacion2);
        facturacion2.setId(2L);
        assertThat(facturacion1).isNotEqualTo(facturacion2);
        facturacion1.setId(null);
        assertThat(facturacion1).isNotEqualTo(facturacion2);
    }
}
