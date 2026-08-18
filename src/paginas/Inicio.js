import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText
} from "@ionic/react";
import { guardarUsuario } from "../almacenamiento";
import { useHistory } from "react-router-dom";


export default function Inicio() {
  const [nombre, setNombre] = useState("");
  const history = useHistory();

  const guardar = () => {
    if (!nombre.trim()) {
      alert("Por favor ingrese su nombre.");
      return;
    }
    guardarUsuario(nombre.trim());
    history.push("/principal");
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding inicio-fondo">
        <div className="header-principal" style={{ textAlign: "center", marginTop: "15px" }}>
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            style={{ width: "140px", marginBottom: "5px" }}
          />
        </div>
        <div className="inicio-contenedor">
          <div className="inicio-card">
            <h1 className="inicio-titulo">Bienvenido</h1>

            <IonText className="inicio-texto">
              Ingrese su nombre
            </IonText>

            <div className="inicio-input-contenedor">
              <IonInput
                placeholder="Nombre"
                value={nombre}
                onIonChange={(e) => setNombre(e.detail.value ?? "")}
                className="inicio-input"
              />
            </div>

            <IonButton expand="block" onClick={guardar} className="inicio-boton">
              Guardar y continuar
            </IonButton>
          </div>
        </div>
        <div className="header-principal" style={{ textAlign: "center", marginTop: "15px" }}>
          <img
            src="/imagenes/logo.png.png"
            alt="AhorrApp logo"
            style={{ width: "140px", marginBottom: "5px" }}
          />
        </div>
      </IonContent>
    </IonPage>
  );
}
