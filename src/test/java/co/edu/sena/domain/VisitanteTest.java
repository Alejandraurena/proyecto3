package co.edu.sena.domain;

import static org.assertj.core.api.Assertions.assertThat;

import co.edu.sena.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VisitanteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Visitante.class);
        Visitante visitante1 = new Visitante();
        visitante1.setId(1L);
        Visitante visitante2 = new Visitante();
        visitante2.setId(visitante1.getId());
        assertThat(visitante1).isEqualTo(visitante2);
        visitante2.setId(2L);
        assertThat(visitante1).isNotEqualTo(visitante2);
        visitante1.setId(null);
        assertThat(visitante1).isNotEqualTo(visitante2);
    }
}
